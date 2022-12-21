<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

class UsernameExists extends Constraint
{
    public string $message = 'The user "{{ username }}" does not exist.';
}
