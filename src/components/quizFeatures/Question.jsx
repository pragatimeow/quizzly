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

const Question = ({ question, userAnswer, onAnswer, showResults }) => {
    return (
        <List>
            <ListItem>
                <ListItemText
                    primary={question.text}
                    sx={{ fontWeight: "bold" }}
                />
                <FormControl>
                    <RadioGroup
                        aria-labelledby={`question-${question.id}-label`}
                        name={`question-${question.id}`}
                        onChange={(e) =>
                            onAnswer(question.id, e.target.value)
                        }
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
            </ListItem>
        </List>
    );
};

export default Question;