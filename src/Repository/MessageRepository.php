<?php

namespace App\Repository;

use App\Entity\Message;
use App\Entity\Room;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Message>
 *
 * @method Message|null find($id, $lockMode = null, $lockVersion = null)
 * @method Message|null findOneBy(array $criteria, array $orderBy = null)
 * @method Message[]    findAll()
 * @method Message[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    /**
     * @return Message[]
     */
    public function findByRoom(Room $room): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.room = :room')
            ->orderBy('m.createdAt', 'ASC')
            ->setParameter('room', $room)
            ->getQuery()
            ->getResult();
    }

    /**
     * @throws NonUniqueResultException
     */
    public function findLastInRoom(Room $room): ?Message
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.room = :room')
            ->orderBy('m.createdAt', 'DESC')
            ->setParameter('room', $room)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
