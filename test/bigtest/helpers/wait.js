export default async function wait(timeout = 3000) {
  await new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
