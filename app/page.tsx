import Pagination from "./components/Pagination";

export default function Home({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  return (
    <div>
      <Pagination
        currentPage={searchParams.page ? parseInt(searchParams.page) : 1}
        itemCount={100}
        pageSize={5}
      />
    </div>
  );
}
