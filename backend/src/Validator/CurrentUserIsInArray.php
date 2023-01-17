<?php

namespace App\Validator;

use Attribute;
use Symfony\Component\Validator\Constraint;

#[Attribute]
class CurrentUserIsInArray extends Constraint
{
    public string $message = 'This collection should contain the current user.';
}
