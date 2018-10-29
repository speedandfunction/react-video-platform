export function urlThumbnailVideo({
  cdn_url, images, i, size = ''
}) {
  const size_img = (size !== '') ? `${size}/` : '';
  const image = images[i] || images[1];

  return `${cdn_url}/images/${size_img}${image}`;
}
