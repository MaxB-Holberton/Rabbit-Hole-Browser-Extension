export default function makeTag(historyEntry) {
  return new Promise((resolve, reject) => {
    try {
      const tag = "derp";

      resolve({
        ...historyEntry,
        tag,
      });
    } catch (error) {
      reject(error);
    }
  });
}
