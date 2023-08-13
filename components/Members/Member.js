import { memo } from "react";
import { useRouter } from "next/router";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit"
import { useGetUsersQuery } from "../../store/users/usersApiSlice";

const Member = ({ userId }) => {
  // Will not create a seperate query/network request -> Will get the member from the data that is already queried.
  // selectFromResult - A selector for the useGetUsersQuery data
  const { member } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      member: data?.entities[userId],
    }),
  });
  const router = useRouter();

  if (member) {
    const handleEdit = () => router.push(`/dash/members/${userId}/edit`);

    const memberRolesString = member.roles.toString().replaceAll(",", ", ");

    const cellStatus = member.active ? "" : "table__cell--inactive";

    return (
      <tr className="table__row member">
        <td className={`table__cell ${cellStatus}`}>{member.username}</td>
        <td className={`table__cell ${cellStatus}`}>{memberRolesString}</td>
        <td className={`table__cell ${cellStatus}`}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <AiOutlineEdit />
          </button>
        </td>
      </tr>
    );
  } else return null;
};

const memoizedMember = memo(Member);

export default memoizedMember;
