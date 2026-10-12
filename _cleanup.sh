set -e
cd /mnt/d/Blog
git rm --cached _gitinit.sh -q 2>/dev/null || true
rm -f _gitinit.sh
git add -A
git commit -q -m "chore: ??????" || echo "?????????"
git push origin main 2>&1 | sed 's/ghp_[A-Za-z0-9]*/***/g' | tail -3
git log --oneline -3
