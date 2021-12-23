export const getHtmlImageElement = async (imageUrl: string, retryCount = 3) => {
  const image = new Image();

  image.style.position = "fixed";
  image.style.top = "9999px";
  image.style.left = "9999px";
  image.className = "edraw-image";

  const retry = async () => {
    let currentRetryCount = 0;
    while (++currentRetryCount < retryCount) {
      try {
        return await getHtmlImageElement(imageUrl, 0);
      } catch {
        continue;
      }
    }

    const error = new Error(
      `url: ${imageUrl}, getImage failed, Retry count ${retryCount}`
    );
    throw error;
  };

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => {
      resolve(image);
    };
    image.onerror = async () => {
      document.body.removeChild(image);
      await retry().catch(reject);
    };
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
    document.body.appendChild(image);
  });
};
