import type { Bookmark } from '../types';

/**
 * 导出书签为 JSON 格式
 */
export function exportToJson(bookmarks: Bookmark[]): string {
  return JSON.stringify(bookmarks, null, 2);
}

/**
 * 下载 JSON 文件
 */
export function downloadJson(bookmarks: Bookmark[], filename = 'bookmarks.json'): void {
  const json = exportToJson(bookmarks);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
