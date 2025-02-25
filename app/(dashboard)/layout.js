import SideBar from "../components/SideBar";

export default function DashboardLayout({ children }) {
  return (
    <main className="container mx-auto p-2 md:pt-2">
      <div className="flex flex-col md:flex-row md:gap-8">
        <SideBar />
        <section className="flex-1">{children}</section>
      </div>
    </main>
  );
}
