<?php

namespace App\Security;

use App\Entity\Room;
use App\Entity\User;
use LogicException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class RoomVoter extends Voter
{
    const READ = 'read';
    const UPDATE = 'update';
    const DELETE = 'delete';
    const CREATE_MESSAGE = 'create_message';

    protected function supports(string $attribute, mixed $subject): bool
    {
        if (!in_array($attribute, [self::READ, self::UPDATE, self::DELETE])) {
            return false;
        }

        if (!$subject instanceof Room) {
            return false;
        }

        return true;
    }

    /**
     * @param mixed|Room $subject
     */
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            // the user must be logged in; if not, deny access
            return false;
        }

        return match($attribute) {
            self::READ, self::CREATE_MESSAGE => $this->canView($subject, $user),
            self::UPDATE => $this->canUpdate($subject, $user),
            self::DELETE => $this->canDelete($subject, $user),
            default => throw new LogicException('This code should not be reached!')
        };
    }

    private function canView(Room $room, User $user): bool
    {
        foreach ($room->getUsers() as $userRoom) {
            if ($userRoom->getUser() === $user) {
                return true;
            }
        }

        return false;
    }

    private function canUpdate(Room $room, User $user): bool
    {
        return $this->canView($room, $user);
    }

    private function canDelete(Room $room, User $user): bool
    {
        return $this->canView($room, $user);
    }
}
