const PageLoader = () => (
  <div
    className="grid min-h-[40vh] place-items-center bg-[#fcf9f8] dark:bg-[#1b1c1c]"
    role="status"
  >
    <span className="sr-only">Loading page</span>
    <span
      className="h-8 w-8 animate-spin rounded-full border-4 border-[#f4dddd] border-t-[#b52330] dark:border-[#3a2526] dark:border-t-[#ff5a5f]"
      aria-hidden="true"
    />
  </div>
);

export default PageLoader;
