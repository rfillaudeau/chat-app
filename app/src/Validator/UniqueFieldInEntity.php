<?php

namespace App\Validator;

use Attribute;
use Symfony\Component\Validator\Attribute\HasNamedArguments;
use Symfony\Component\Validator\Constraint;

#[Attribute]
class UniqueFieldInEntity extends Constraint
{
    public string $message = 'The {{ field }} "{{ value }}" is already used on the entity {{ entityClass }}.';
    public string $field;
    public string $entityClass;

    #[HasNamedArguments]
    public function __construct(string $field, string $entityClass, array $groups = null, mixed $payload = null)
    {
        parent::__construct([], $groups, $payload);

        $this->field = $field;
        $this->entityClass = $entityClass;
    }

    // TODO: Refacto to allow this constraint to work on edit mode (use the entity id)
//    public function getTargets(): string
//    {
//        return self::CLASS_CONSTRAINT;
//    }
}
