<?php

namespace App\Repository;

use App\Entity\UserRoom;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserRoom>
 *
 * @method UserRoom|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserRoom|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserRoom[]    findAll()
 * @method UserRoom[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRoomRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserRoom::class);
    }
}
