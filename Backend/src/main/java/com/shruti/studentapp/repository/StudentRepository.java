package com.shruti.studentapp.repository;

import com.shruti.studentapp.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student,Long>{
    List<Student> findByUsernameContainingIgnoreCase(String username);
}

