import React from "react";
import {
    List,
    ListItem,
    ListItemText,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import styled from "styled-components";

const QuestionList = styled(List)`
    && {
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;

const QuestionItem = styled(ListItem)`
    && {
        &:not(:last-child) {
            border-bottom: 1px solid #eee;
        }
    }
`;

const Question = ({ question, userAnswer, onAnswer, showResults }) => {
    return (
        <QuestionList>
            <QuestionItem>
                <ListItemText
                    primary={question.text}
                    sx={{ fontWeight: "bold" }}
                />
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
            </QuestionItem>
        </QuestionList>
    );
};

export default Question;