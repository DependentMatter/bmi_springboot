package com.bmi.service;

import com.bmi.model.BmiRecord;
import com.bmi.repository.BmiRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BmiService {
    @Autowired
    private BmiRecordRepository repository;

    public BmiRecord calculateAndSave(BmiRecord record) {
        double bmi = record.getWeight() / (record.getHeight() * record.getHeight());
        record.setBmi(bmi);
        return repository.save(record);
    }

    public BmiRecord getById(Long id) {
        return repository.findById(id).orElse(null);
    }
}
