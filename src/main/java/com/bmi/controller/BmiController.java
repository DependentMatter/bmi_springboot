package com.bmi.controller;

import com.bmi.model.BmiRecord;
import com.bmi.service.BmiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bmi")
@CrossOrigin // Allow frontend to call this API
public class BmiController {
    @Autowired
    private BmiService bmiService;

    @PostMapping
    public BmiRecord calculateBmi(@RequestBody BmiRecord record) {
        return bmiService.calculateAndSave(record);
    }

    @GetMapping("/{id}")
    public BmiRecord getBmi(@PathVariable Long id) {
        return bmiService.getById(id);
    }
}
