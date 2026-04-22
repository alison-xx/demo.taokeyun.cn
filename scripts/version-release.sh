#!/usr/bin/env bash
# ============================================================
# 灵策 AI - 自动化版本发布脚本 (SemVer)
# 用法: ./scripts/version-release.sh [patch|minor|major]
# ============================================================

set -euo pipefail

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step()  { echo -e "${BLUE}>> $1${NC}"; }

# 1. 环境检查
log_step "正在进行发布前检查..."

# 检查是否在主分支
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "main" ]]; then
    log_error "发布必须在 main 分支进行 (当前分支: $BRANCH)"
    exit 1
fi

# 检查是否有未提交的更改
if [[ -n $(git status --short) ]]; then
    log_warn "检测到未提交的更改，请先提交或暂存："
    git status --short
    exit 1
fi

# 2. 敏感信息与冗余文件扫描
log_step "正在扫描敏感信息和无关文件..."
SENSITIVE_FILES=(".env" ".user.ini" "latest.zip" "lingce-full.dat" "lingce-repo.bundle")
for file in "${SENSITIVE_FILES[@]}"; do
    if git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
        log_error "安全警告: 敏感文件 '$file' 仍在 Git 跟踪中！"
        log_error "请先运行 'git rm --cached $file' 并提交。"
        exit 1
    fi
done
log_info "安全扫描通过。"

# 3. 版本计算
log_step "正在计算新版本号..."
CURRENT_VERSION=$(node -p "require('./package.json').version")
BUMP_TYPE=${1:-patch}

# 简单的版本递增逻辑
IFS='.' read -ra ADDR <<< "$CURRENT_VERSION"
MAJOR=${ADDR[0]}
MINOR=${ADDR[1]}
PATCH=${ADDR[2]}

if [[ "$BUMP_TYPE" == "major" ]]; then
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
elif [[ "$BUMP_TYPE" == "minor" ]]; then
    MINOR=$((MINOR + 1))
    PATCH=0
else
    PATCH=$((PATCH + 1))
fi

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
log_info "当前版本: $CURRENT_VERSION -> 新版本: $NEW_VERSION"

# 4. 更新文件
log_step "正在更新版本文件..."

# 更新 package.json
sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json

# 更新 CHANGELOG.md
DATE=$(date +%Y-%m-%d)
CHANGES=$(git log --pretty=format:"- %s" "origin/main..HEAD" | grep -v "chore: release" || echo "- 性能优化与功能改进")

TEMP_LOG=$(mktemp)
echo -e "# Changelog\n\n## [$NEW_VERSION] - $DATE\n\n### ✨ 变更内容\n$CHANGES\n" > "$TEMP_LOG"
tail -n +3 CHANGELOG.md >> "$TEMP_LOG"
mv "$TEMP_LOG" CHANGELOG.md

# 5. 提交与标签
log_step "正在创建发布记录..."
RELEASE_BRANCH="release/v$NEW_VERSION"
git checkout -b "$RELEASE_BRANCH"
git add package.json CHANGELOG.md
git commit -m "chore: release v$NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"

# 6. 推送到远程
log_step "正在推送到远程仓库..."
git push origin "$RELEASE_BRANCH"
git push origin "v$NEW_VERSION"

# 切回主分支并合并
git checkout main
git merge --no-ff "$RELEASE_BRANCH" -m "merge: release v$NEW_VERSION"
git push origin main

log_info "=========================================="
log_info "✅ 发布成功！版本 v$NEW_VERSION 已上线。"
log_info "仓库地址: https://github.com/alison-xx/demo.taokeyun.cn"
log_info "=========================================="
