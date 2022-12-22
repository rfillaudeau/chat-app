<?php

namespace App\Validator;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class UniqueFieldInEntityValidator extends ConstraintValidator
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    )
    {}

    public function validate(mixed $value, Constraint $constraint)
    {
        if (!$constraint instanceof UniqueFieldInEntity) {
            throw new UnexpectedTypeException($constraint, UniqueFieldInEntity::class);
        }

        // custom constraints should ignore null and empty values to allow
        // other constraints (NotBlank, NotNull, etc.) to take care of that
        if (null === $value || '' === $value) {
            return;
        }

        $searchResults = $this->entityManager
            ->getRepository($constraint->entityClass)
            ->findBy([
                $constraint->field => $value
            ]);

        if (count($searchResults) > 0) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ field }}', $constraint->field)
                ->setParameter('{{ entityClass }}', $constraint->entityClass)
                ->setParameter('{{ value }}', $value)
                ->addViolation();
        }
    }
}
