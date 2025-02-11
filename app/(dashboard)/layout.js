import SideBar from "../components/SideBar";

export default function DashboardLayout({ children }) {
  return (
    <main className="container mx-auto pt-6">
      <div className="flex gap-8">
        <SideBar />
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
