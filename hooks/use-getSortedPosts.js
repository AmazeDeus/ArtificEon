// Pass in an amount and sortOrder("asc" or "desc") to get the specified amount of posts, sorted asc or desc depending on the updatedAt value.
// skip allows you to skip a certain amount of posts depending on the sorting case (eg. skip the 3 first posts returned).
export const useGetSortedPosts = (
  posts,
  amount = 0,
  sortOrder = "asc" || "desc",
  skip = 0
) => {
  if (!posts) return;

  const { ids, entities } = posts;

  let sortedPosts;
  if (sortOrder === "asc") {
    sortedPosts = [...ids]
      .map((id) => entities[id])
      .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
      .slice(skip, skip + amount);
  } else if (sortOrder === "desc") {
    sortedPosts = [...ids]
      .map((id) => entities[id])
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(skip, skip + amount);
  }
  
  return { sortedPosts };
};
