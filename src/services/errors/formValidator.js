
import express from 'express'
import {body} from 'express-validator'

export const userValidator = [
    body('name').exists().withMessage('name is mandatory'),
    body('surname').exists().withMessage('surname is mandatory'),
    body('email').exists().withMessage('email is mandatory'),
    body('password').exists().withMessage('password is mandatory'),
    body('role').exists().withMessage('role is mandatory'),
]
