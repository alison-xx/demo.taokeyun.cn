#!/usr/bin/env bash
# ============================================================
# 灵策智算 - 发布流水线脚本
# 用法: ./scripts/release.sh [production|staging]
# ============================================================

set -euo pipefail

ENV=${1:-production}
PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$PROJECT_ROOT"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

log_info "=== 灵策智算发布流水线 ==="
log_info "环境: $ENV"
log_info "节点: $(hostname)"
log_info "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo

# ── 0. 环境检查 ──────────────────────────────────────────
log_info "[0/5] 环境检查..."

if [[ ! -f .env ]]; then
  log_error ".env 文件不存在，请先配置环境变量"
  exit 1
fi

if [[ "$ENV" == "production" ]]; then
  if [[ -z "${JWT_SECRET:-}" ]]; then
    log_error "生产环境必须配置 JWT_SECRET 环境变量"
    exit 1
  fi
  if [[ -z "${DB_PASSWORD:-}" ]]; then
    log_error "生产环境必须配置 DB_PASSWORD 环境变量"
    exit 1
  fi
fi

log_info "环境检查通过"
echo

# ── 1. 依赖安装 ──────────────────────────────────────────
log_info "[1/5] 安装依赖..."
npm ci --legacy-peer-deps --quiet
log_info "依赖安装完成"
echo

# ── 2. 类型检查 ──────────────────────────────────────────
log_info "[2/5] TypeScript 类型检查..."
npm run check
log_info "类型检查通过"
echo

# ── 3. 代码检查 ──────────────────────────────────────────
log_info "[3/5] ESLint 检查..."
npm run lint
log_info "ESLint 检查通过"
echo

# ── 4. 生产构建 ──────────────────────────────────────────
log_info "[4/5] 生产构建..."
NODE_ENV=production npm run build
log_info "构建完成 → dist/"
echo

# ── 5. 服务重启 ──────────────────────────────────────────
log_info "[5/5] 重启服务..."

# 停止旧进程（graceful shutdown）
if [[ -f .pid ]]; then
  OLD_PID=$(cat .pid)
  if kill -0 "$OLD_PID" 2>/dev/null; then
    log_info "停止旧进程 PID=$OLD_PID"
    kill -TERM "$OLD_PID"
    sleep 3
    if kill -0 "$OLD_PID" 2>/dev/null; then
      log_warn "进程未响应，强制杀死"
      kill -9 "$OLD_PID" || true
    fi
  fi
fi

# 启动新进程
export NODE_ENV=$ENV
export PORT=${PORT:-3001}
nohup npm run start > logs/app.log 2>&1 &
echo $! > .pid

sleep 2

if kill -0 $(cat .pid) 2>/dev/null; then
  log_info "服务启动成功 PID=$(cat .pid)"
else
  log_error "服务启动失败，查看日志: logs/app.log"
  exit 1
fi

# 健康检查
sleep 3
if curl -sf http://127.0.0.1:${PORT}/health > /dev/null 2>&1; then
  log_info "健康检查通过"
else
  log_error "健康检查失败，请检查服务日志"
  exit 1
fi

echo
log_info "=== 发布完成 ==="
log_info "访问地址: http://127.0.0.1:${PORT}/"
log_info "日志位置: logs/app.log"
