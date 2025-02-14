import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TeamTable = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const storedConsultData = localStorage.getItem("consultData");
        const parsedData = JSON.parse(storedConsultData);
        const userId = parsedData?._id;

        if (!userId) {
          toast.error("User not authenticated");
          return;
        }

        const response = await axios.get(`https://newportal-backend.onrender.com/consult/team/${userId}`);
        setTeamMembers(response.data.teamMembers);
      } catch (error) {
        toast.error("Error fetching team data");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <div>Show</div>
        <input
          type="text"
          placeholder="Search"
          className="border rounded-md p-2"
        />
      </div>
      {loading ? (
        <div className="flex justify-center p-8">
         <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-500"></div>
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2">No</th>
              <th className="p-2">Reg Date</th>
              <th className="p-2">Username</th>
              <th className="p-2">Name</th>
              <th className="p-2">Mobile Number</th>
              <th className="p-2">CID</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  {new Date(member.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">{member.username}</td>
                <td className="p-2">{`${member.firstName} ${member.lastName}`}</td>
                <td className="p-2">{member.phone}</td>
                <td className="p-2">{member.cid}</td>
                <td className="p-2">{member.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeamTable;