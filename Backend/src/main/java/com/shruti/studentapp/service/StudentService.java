package com.shruti.studentapp.service;

import com.shruti.studentapp.dto.StudentRequestDto;
import com.shruti.studentapp.dto.StudentResponseDto;
import com.shruti.studentapp.entity.Student;
import com.shruti.studentapp.exception.StudentNotFoundException;
import com.shruti.studentapp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // ADD STUDENT
    public StudentResponseDto addStudent(StudentRequestDto dto){

        Student student = mapToEntity(dto);

        Student savedStudent = studentRepository.save(student);

        return mapToResponseDto(savedStudent);
    }

    // GET ALL STUDENTS
    public List<StudentResponseDto> getAllStudents(){

        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    // GET STUDENT BY ID
    public StudentResponseDto getStudentById(Long id){

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id " + id
                        ));

        return mapToResponseDto(student);
    }

    // UPDATE STUDENT
    public StudentResponseDto updateStudent(Long id,
                                            StudentRequestDto dto){

        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id " + id
                        ));

        existingStudent.setUsername(dto.getName());
        existingStudent.setEmail(dto.getEmail());
        existingStudent.setCourse(dto.getCourse());
        existingStudent.setAge(dto.getAge());

        Student updatedStudent = studentRepository.save(existingStudent);

        return mapToResponseDto(updatedStudent);
    }

    // DELETE STUDENT
    public String deleteStudent(Long id){

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id " + id
                        ));

        studentRepository.delete(student);

        return "Student Deleted Successfully";
    }

    // PAGINATION
    public Page<StudentResponseDto> getStudentWithPagination(
            int page,
            int size
    ){

        Pageable pageable = PageRequest.of(page, size);

        Page<Student> studentPage =
                studentRepository.findAll(pageable);

        return studentPage.map(this::mapToResponseDto);
    }

    // SEARCH STUDENT
    public List<StudentResponseDto> searchStudentsByUsername(String name){

        return studentRepository
                .findByUsernameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    // ENTITY -> RESPONSE DTO
    private StudentResponseDto mapToResponseDto(Student student){

        StudentResponseDto dto = new StudentResponseDto();

        dto.setId(student.getId());
        dto.setName(student.getUsername());
        dto.setEmail(student.getEmail());
        dto.setCourse(student.getCourse());
        dto.setAge(student.getAge());

        return dto;
    }

    // REQUEST DTO -> ENTITY
    private Student mapToEntity(StudentRequestDto dto){

        Student student = new Student();

        student.setUsername(dto.getName());
        student.setEmail(dto.getEmail());
        student.setCourse(dto.getCourse());
        student.setAge(dto.getAge());

        return student;
    }
}