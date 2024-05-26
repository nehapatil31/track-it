import Pagination from "./components/Pagination";

export default function Home() {
  return (
    <div>
      <Pagination currentPage={20} itemCount={100} pageSize={5} />
    </div>
  );
}
