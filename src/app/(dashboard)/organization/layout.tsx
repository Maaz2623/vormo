import { client } from "@/lib/hono";
export default async function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await client.api.organizations.$get();

  console.log(response);

  return <main className=" h-full ">{children}</main>;
}
