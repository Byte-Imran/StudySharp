import { LazyLoadImage } from "react-lazy-load-image-component";

const LazyImage = ({
  alt = "",
  className = "",
  threshold = 100,
  ...imageProps
}) => (
  <LazyLoadImage
    {...imageProps}
    alt={alt}
    className={className}
    threshold={threshold}
  />
);

export default LazyImage;
