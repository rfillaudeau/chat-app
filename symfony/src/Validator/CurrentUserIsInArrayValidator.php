<?php

namespace App\Validator;

use App\Entity\User;
use App\Entity\UserRoom;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class CurrentUserIsInArrayValidator extends ConstraintValidator
{
    public function __construct(private readonly Security $security)
    {
    }

    public function validate(mixed $value, Constraint $constraint)
    {
        if (!($constraint instanceof CurrentUserIsInArray)) {
            throw new UnexpectedTypeException($constraint, CurrentUserIsInArray::class);
        }

        if (!($value instanceof ArrayCollection)) {
            throw new UnexpectedTypeException($value, ArrayCollection::class);
        }

        $user = $this->security->getUser();
        if (!($user instanceof User)) {
            throw new AuthenticationException(sprintf(
                'A logged used is required to use the validator "%s".',
                self::class
            ));
        }

        $isInArray = false;
        foreach ($value as $item) {
            $userToVerify = $item;
            if ($item instanceof UserRoom) {
                $userToVerify = $item->getUser();
            }

            if ($userToVerify === $user) {
                $isInArray = true;
                break;
            }
        }

        if (!$isInArray) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}
