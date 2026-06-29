package com.shruti.studentapp.controller;

import com.shruti.studentapp.dto.ApiResponse;
import com.shruti.studentapp.dto.StudentRequestDto;
import com.shruti.studentapp.dto.StudentResponseDto;
import com.shruti.studentapp.entity.Student;
import com.shruti.studentapp.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.JstlUtils;

import java.util.List;

@Tag(name = "Student APIs", description = "CRUD operation for students")
@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Operation(summary = "Add a new student")
    @PostMapping
    public StudentResponseDto addStudent(@Valid @RequestBody StudentRequestDto dto){
        return studentService.addStudent(dto);
    }

    @GetMapping
    public ApiResponse<List<StudentResponseDto>> getAllStudents(){

        List<StudentResponseDto> students = studentService.getAllStudents();

        return new ApiResponse<>(
                true,
                "Students fetched successfully",
                students
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<StudentResponseDto> getStudentById(@PathVariable Long id){

        StudentResponseDto student = studentService.getStudentById(id);

        return new ApiResponse<>(
                true,
                "Student fetched successfully",
                student
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<StudentResponseDto> updateStudent(
            @PathVariable Long id,
            @RequestBody StudentRequestDto dto){

        StudentResponseDto updated = studentService.updateStudent(id, dto);

        return new ApiResponse<>(
                true,
                "Student updated successfully",
                updated
        );
    }

    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id){

        return studentService.deleteStudent(id);
    }

    @GetMapping("/pagination")
    public Page<StudentResponseDto> getStudentsWithPagination(
            @RequestParam int page,
            @RequestParam int size
    ){
        return studentService.getStudentWithPagination(page,size);
    }

    @GetMapping("search")
    public List<StudentResponseDto> searchStudents(@RequestParam String username){
        return studentService.searchStudentsByUsername(username);
    }


}
