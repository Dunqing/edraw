/**
 * 导出任何文件
 * @param params
 * @returns
 */
export const exportAnything = ({ value, filename, type }: ExportOptions) => {
  const blobURL = window.URL.createObjectURL(new Blob([value], { type }));
  const el = document.createElement("a");
  el.download = filename;
  el.href = blobURL;
  el.click();
  URL.revokeObjectURL(blobURL);
  return blobURL;
};
