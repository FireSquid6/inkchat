export async function listenToConsole() {
  for await (const line of console) {
    console.log("You typed:", line)
  }
}
