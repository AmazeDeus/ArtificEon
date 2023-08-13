import { PulseLoader } from "react-spinners";
import { useGetUsersQuery } from "../../store/users/usersApiSlice";

import classes from "../CSS/Form.module.css";

const override = {
    margin: "1rem auto",
  };

const FilterOptions = ({ setShowUserNotes}) => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("membersList", {
    refetchOnMountOrArgChange: true,
  });

  const onUserIdChanged = (e) => setShowUserNotes(e.target.value);

  let content;

  if (isLoading) content = <PulseLoader cssOverride={override} color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users;

    const options = ids?.length && [
        <option key="show-all" value="show-all" className={classes.form__select_option}>
          Show All
        </option>,
        ...ids.map((userId) => (
          <option key={userId} value={users.entities[userId].username} className={classes.form__select_option}>
            {users.entities[userId].username}
          </option>
        )),
      ];

    content = (
      <>
        <label
          htmlFor="notes-filter"
        >
          Filter Notes:
        </label>
        <select
          id="notes-filter"
          name="username"
          className={classes.form__select}
          onChange={onUserIdChanged}
        >
          {options}
        </select>
      </>
    );
  }

  return <div>{content}</div>;
};

export default FilterOptions;
