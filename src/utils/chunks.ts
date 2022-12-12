export function createChunks<T>(arr: T[], chunkSize: number): T[][] {
  return arr.reduce<T[][]>((chunks, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (chunks[chunkIndex]) {
      chunks[chunkIndex].push(item);
    } else {
      chunks[chunkIndex] = [item];
    }
    return chunks;
  }, []);
}
