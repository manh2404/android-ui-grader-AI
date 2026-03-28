export type Semester = "HK1" | "HK2" | "HK3";
export type ClassroomStatus = "active" | "archived";

export type ClassroomUser = {
    _id?: string;
    name?: string;
    email?: string;
};

export type Classroom = {
    _id: string;
    name: string;
    code: string;
    description?: string;
    semester?: Semester;
    academicYear?: string;
    status?: ClassroomStatus;
    teacherId?: string | ClassroomUser | null;
    studentIds?: Array<string | ClassroomUser>;
    createdAt?: string;
    updatedAt?: string;
};