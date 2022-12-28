<?php

namespace App\Validator;

use App\Repository\UserRepository;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class UsernameExistsValidator extends ConstraintValidator
{
    public function __construct(
        private readonly UserRepository $userRepository
    )
    {}

    /**
     * @throws NonUniqueResultException
     */
    public function validate(mixed $value, Constraint $constraint)
    {
        if (!$constraint instanceof UsernameExists) {
            throw new UnexpectedTypeException($constraint, UsernameExists::class);
        }

        // custom constraints should ignore null and empty values to allow
        // other constraints (NotBlank, NotNull, etc.) to take care of that
        if (null === $value || '' === $value) {
            return;
        }

        if (null === $this->userRepository->findOneByUsername($value)) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ username }}', $value)
                ->addViolation();
        }
    }
}
