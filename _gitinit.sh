set -e
cd /mnt/d/Blog
git config --global --add safe.directory /mnt/d/Blog 2>/dev/null || true
git init -b main 2>/dev/null || git init
git config user.name "12Eternity31"
git config user.email "12Eternity31@users.noreply.github.com"
git config core.autocrlf false
git config core.fileMode false
git add -A
echo "--- ???????? ---"
git diff --cached --name-only | wc -l
echo "--- ????????? node_modules / public? ---"
git diff --cached --name-only | grep -E "node_modules|^public/" | head -5 || echo "OK: ?? node_modules/public"
echo "--- ?????? ---"
git diff --cached --name-only | grep -c "^themes/butterfly/" || true
git commit -q -m "init: Hexo + Butterfly ???????? WriteUp?GitHub Actions ?????" && echo "COMMIT_OK"
git log --oneline | head -3
