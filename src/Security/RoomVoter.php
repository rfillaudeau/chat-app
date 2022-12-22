<?php

namespace App\Security;

use App\Entity\Room;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class RoomVoter extends Voter
{
    const VIEW = 'view';
    const EDIT = 'edit';

    protected function supports(string $attribute, mixed $subject): bool
    {
        if (!in_array($attribute, [self::VIEW, self::EDIT])) {
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
            self::VIEW => $this->canView($subject, $user),
//            self::EDIT => $this->canEdit($subject, $user),
            default => throw new \LogicException('This code should not be reached!')
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

//    private function canEdit(Room $room, User $user): bool
//    {
//        // this assumes that the Post object has a `getOwner()` method
//        return $user === $post->getOwner();
//    }
}
