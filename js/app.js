 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/app.js b/app.js
new file mode 100644
index 0000000000000000000000000000000000000000..6333253bf962ad77807c6518c6e8b542b3162e9d
--- /dev/null
+++ b/app.js
@@ -0,0 +1,26 @@
+const keychain = document.querySelector('.keychain');
+const keys = document.querySelectorAll('.key');
+const keyList = document.querySelector('.keys');
+
+const clearActive = () => {
+  keychain.classList.remove('active');
+  keys.forEach((key) => key.classList.remove('is-active'));
+};
+
+const setActive = (key) => {
+  keychain.classList.add('active');
+  keys.forEach((item) => item.classList.toggle('is-active', item === key));
+};
+
+keys.forEach((key) => {
+  key.addEventListener('mouseenter', () => setActive(key));
+  key.addEventListener('focus', () => setActive(key));
+  key.addEventListener('click', () => setActive(key));
+});
+
+keyList.addEventListener('mouseleave', clearActive);
+keyList.addEventListener('focusout', (event) => {
+  if (!keyList.contains(event.relatedTarget)) {
+    clearActive();
+  }
+});
 
EOF
)
