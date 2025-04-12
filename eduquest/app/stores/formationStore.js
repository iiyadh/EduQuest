import { create } from "zustand";
import axios from "axios";


const useFormationStore = create((set, get) => {
    return {
        myFormations: [],

        fetchMyFormations : async (user) => {
            if (!user) return;
    
            try {
                const res = await axios.get(`http://localhost:8000/student/ownformations/${user.id._id}`);
                set({ myFormations: res.data });
            } catch (err) {
                console.error("Fetch MyFormations Error:", err);
            }
        },

        enrollFormationByCode: async (code,user)=>{
            try{
                const res = await axios.post(
                    `http://localhost:8000/student/enrollformation/${code}`,
                    { 
                        user_id: user.id._id,
                        data: "code"
                    }
                );
                set((state) => ({
                    myFormations: [...state.myFormations, res.data.formation],
                }));
            }catch(err){
                console.log(err);
            }
        },

        enrollFormation: async (course,user) => {
            try {
                const res = await axios.post(
                    `http://localhost:8000/student/enrollformation/${course.codeformation}`,
                    { 
                        user_id: user.id._id,
                        data: course._id
                    }
                );
                set((state) => ({
                    myFormations: [...state.myFormations, res.data.formation],
                }));
            } catch (err) {
                console.error("Enroll Error:", err);
            }
        },

        quitFormation: async (course,user) => {
            try {
                await axios.delete(`http://localhost:8000/student/quitformation`, {
                    data: {
                        user_id: user.id._id,
                        formation_id: course._id,
                    },
                });
                set((state) => ({
                    myFormations: state.myFormations.filter((formation) => formation._id !== course._id),
                }));
            } catch (err) {
                console.error("Quit Formation Error:", err);
            }
        },
    };
});

export default useFormationStore;
