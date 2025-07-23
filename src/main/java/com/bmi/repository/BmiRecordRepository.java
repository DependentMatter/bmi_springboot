package com.bmi.repository;

import com.bmi.model.BmiRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BmiRecordRepository extends JpaRepository<BmiRecord, Long> {
}
