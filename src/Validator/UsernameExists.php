<?php

namespace App\Validator;

use Attribute;
use Symfony\Component\Validator\Constraint;

#[Attribute]
class UsernameExists extends Constraint
{
    public string $message = 'The user "{{ username }}" does not exist.';
}
