// Bridges the app to the splash loader defined inline in index.html.

// Hides the splash loader once every promise from getTasks() settles.
// getTasks only runs while the loader is showing (first load of "/").
export const hideLoaderWhen = (getTasks) => {
  const loader = window.CNLoader;
  if (loader?.pending) loader.finishWhen(getTasks());
};

// Resolves once an <img> has loaded (or failed), so it is ready to paint.
export const imageReady = (img) => {
  if (!img || img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener("load", resolve, { once: true });
    img.addEventListener("error", resolve, { once: true });
  });
};
