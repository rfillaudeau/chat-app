<?php

namespace App\Security;

use App\Entity\User;
use LogicException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class UserVoter extends Voter
{
    const UPDATE = 'update';

    protected function supports(string $attribute, mixed $subject): bool
    {
        if ($attribute != self::UPDATE) {
            return false;
        }

        if (!($subject instanceof User)) {
            return false;
        }

        return true;
    }

    /**
     * @param mixed|User $subject
     */
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $currentUser = $token->getUser();
        if (!($currentUser instanceof User)) {
            // the user must be logged in; if not, deny access
            return false;
        }

        return match ($attribute) {
            self::UPDATE => $this->canUpdate($subject, $currentUser),
            default => throw new LogicException('This code should not be reached!')
        };
    }

    private function canUpdate(User $user, User $currentUser): bool
    {
        return $user->getId() === $currentUser->getId();
    }
}
