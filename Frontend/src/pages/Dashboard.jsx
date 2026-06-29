import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";
import { toast } from "react-toastify";

export default function Dashboard() {

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState("");
    const [age, setAge] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [searchUsername, setSearchUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("id");
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalCourses, setTotalCourses] = useState(0);
    const [averageAge, setAverageAge] = useState(0);

    const role = localStorage.getItem("role");
    console.log("ROLE =", role);

    const navigate = useNavigate();

    const fetchStudents = async () => {
        try {
            const response = await api.get("/students");

            console.log("FULL RESPONSE =", response.data);

            setStudents(response.data.data);

        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async () => {

    try {

        const response = await api.get(
            `/students/search?username=${searchUsername}`
        );

        console.log("SEARCH RESULT =", response.data);

        setStudents(response.data);

    } catch (error) {

        console.log(error);

    }
};

    const handleAddStudent = async () => {

        if (!name || !email || !course || !age) {
        setError("All fields are required");
        return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
        setError("Please enter a valid email address");
        return;
    }

        setError("");

    try {

        const response = await api.post("/students", {
            name,
            email,
            course,
            age: Number(age)
        });

        console.log("STUDENT ADDED =", response.data);
        toast.success("Student added successfully!");
        fetchStudents();

        setName("");
        setEmail("");
        setCourse("");
        setAge("");

    } catch (error) {

        console.log(error);
        toast.error("Failed to add student!");

    }
};

const handleDeleteStudent = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
        await api.delete(`/students/${id}`);
        toast.success("Student deleted successfully!");
        fetchStudents();
    } catch (error) {
        console.log(error);
        toast.error("Failed to delete student!");
    }
};

const handleUpdateStudent = async () => {

    try {

        const response = await api.put(
            `/students/${selectedStudent.id}`,
            {
                name: selectedStudent.name,
                email: selectedStudent.email,
                course: selectedStudent.course,
                age: Number(selectedStudent.age)
            }
        );

        console.log("UPDATED =", response.data);

        toast.success("Student updated successfully!");

        fetchStudents();

        setSelectedStudent(null);

    } catch (error) {

        console.log(error);

        toast.error("Failed to update student!");

    }
};
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
        toast.info("Logged out successfully!");
    };

    useEffect(() => {

    const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetchStudentsWithPagination(0);

    }, []);

    const fetchStudentsWithPagination = async (pageNumber) => {

    try {
        setLoading(true);

        const response = await api.get(
            `/students/pagination?page=${pageNumber}&size=${size}`
        );

        console.log(response.data);

        setStudents(response.data.content);
        setLoading(false);

    } catch (error) {
        setLoading(false);
        console.log(error);

    }
};

    console.log(selectedStudent);

    const sortedStudents = [...students].sort((a, b) => {

    if (sortBy === "name") {
        return a.name.localeCompare(b.name);
    }

    if (sortBy === "age") {
        return a.age - b.age;
    }

    return a.id - b.id;
});

useEffect(() => {

    // Total Students
    setTotalStudents(students.length);

    // Total Unique Courses
    const uniqueCourses = new Set(
        students.map(student => student.course)
    );

    setTotalCourses(uniqueCourses.size);

    // Average Age
    if (students.length > 0) {

        const totalAge = students.reduce(
            (sum, student) => sum + student.age,
            0
        );

        setAverageAge(
            Math.round(totalAge / students.length)
        );

    } else {
        setAverageAge(0);
    }

}, [students]);

    return (
        <div className="container">
            <div className="navbar">
                <h2>Student Dashboard</h2>

                <div className="dashboard-cards">

                    <div className="card">
                        <h3>Total Students</h3>
                        <h1>{totalStudents}</h1>
                    </div>

                    <div className="card">
                        <h3>Total Courses</h3>
                        <h1>{totalCourses}</h1>
                    </div>

                    <div className="card">
                        <h3>Average Age</h3>
                        <h1>{averageAge}</h1>
                    </div>

                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        {role === "ADMIN" && (
        <div className="form-section">
            <h3>Add Student</h3>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <br /><br />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
            />

            <br /><br />

            <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />

            <br /><br />
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleAddStudent}>
                Add Student
            </button>

            <br /><br />
        </div>
        )}

            <br /><br />

            {role === "ADMIN" && selectedStudent && (
        <div className="form-section">
            <h3>Edit Student</h3>

            <input
                type="text"
                value={selectedStudent.name}
                onChange={(e) =>
                    setSelectedStudent({
                        ...selectedStudent,
                        name: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="email"
                value={selectedStudent.email}
                onChange={(e) =>
                    setSelectedStudent({
                        ...selectedStudent,
                        email: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="text"
                value={selectedStudent.course}
                onChange={(e) =>
                    setSelectedStudent({
                        ...selectedStudent,
                        course: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="number"
                value={selectedStudent.age}
                onChange={(e) =>
                    setSelectedStudent({
                        ...selectedStudent,
                        age: e.target.value
                    })
                }
            />

            <br /><br />

            <br /><br />

            <button onClick={handleUpdateStudent}>
                Update Student
            </button>
        </div>
    )}

    
    <div className="form-section">
    <h3>Search Student</h3>

    <input
        type="text"
        placeholder="Enter username"
        value={searchUsername}
        onChange={(e) => setSearchUsername(e.target.value)}
    />

    <br /><br />

    <button onClick={handleSearch}>
        Search
    </button>
    </div>
    

    <br /><br />
            {loading && <h3>Loading students...</h3>}

            <h3>Sort Students</h3>

        <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
        >
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="age">Age</option>
        </select>

<br /><br />
            <table className="student-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Age</th>
                        <th>Action</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {sortedStudents.map(student => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.course}</td>
                            <td>{student.age}</td>
                            <td>
                                {role === "ADMIN" && (
                                <button className="delete-btn"onClick={() => handleDeleteStudent(student.id)}>
                                    Delete
                                </button>
                                )}
                            </td>
                            <td>
                                {role === "ADMIN" && (
                                <button className="edit-btn"onClick={() => setSelectedStudent(student)}>
                                    Edit
                                </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <br /><br />

<button
    onClick={() => {
        const newPage = page - 1;
        setPage(newPage);
        fetchStudentsWithPagination(newPage);
    }}
    disabled={page === 0}
>
    Previous
</button>

&nbsp;&nbsp;

<button
    onClick={() => {
        const newPage = page + 1;
        setPage(newPage);
        fetchStudentsWithPagination(newPage);
    }}
>
    Next
</button>
        </div>
    );
}