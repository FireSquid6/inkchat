export default function ServerHomePage({ params }: { params: { address: string } }) {
  return (
    <main>
      <h1>Server Home Page</h1>
      <p>Address: {params.address}</p>
    </main>
  )
}
