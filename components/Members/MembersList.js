import { useEffect } from "react";
import { useRouter } from "next/router";
import { useGetUsersQuery } from "../../store/users/usersApiSlice";
import Member from "./Member";
import { PulseLoader } from "react-spinners";

function MembersList() {
  const router = useRouter();
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("membersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  }); // Refetch data during specific circumstances. pollingInterval - Re-query the data (members/users) every 1 min.
  // membersList label will be viewable in Redux devtools

  useEffect(() => {
    const handlePopstate = () => {
      if (router.query.nid) {
        router.push("/dash");
      }
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users; // users - contains the ids array and the entities

    const tableContent =
      ids?.length &&
      ids.map((userId) => <Member key={userId} userId={userId} />);

    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
}

export default MembersList;
