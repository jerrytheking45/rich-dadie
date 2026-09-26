import type {
  SupportAttachment,
} from '@/src/lib/types/support';

export function downloadSupportAttachment(
  blob: Blob,
  attachment: SupportAttachment,
): void {
  const url =
    window.URL.createObjectURL(blob);

  const anchor =
    document.createElement('a');

  anchor.href = url;
  anchor.download =
    attachment.file_name ||
    'attachment';

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.URL.revokeObjectURL(url);
}