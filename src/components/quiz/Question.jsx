import React from "react";
import {
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
} from "@mui/material";

const Question = ({ question, userAnswer, onAnswer, showResults }) => {
    return (
        <Box sx={{ backgroundColor: "white", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", padding: "1rem" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
                {question.text}
            </Typography>
            <FormControl>
                <RadioGroup
                    aria-labelledby={`question-${question.id}-label`}
                    name={`question-${question.id}`}
                    onChange={(e) => onAnswer(question.id, e.target.value)}
                >
                    {question.options.map((option, index) => (
                        <FormControlLabel
                            key={index}
                            value={option}
                            control={<Radio />}
                            label={option}
                            disabled={showResults}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default Question;