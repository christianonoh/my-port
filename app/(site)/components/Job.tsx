import { JobType } from "@/types/jobType";
import Image from "next/image";

type Props = {
  job: JobType;
};

const Job = ({ job }: Props) => {
  return (
    <div className="flex items-start lg:gap-x-6 gap-x-4 max-w-2xl relative before:absolute before:bottom-0 before:top-[4.5rem] before:left-7 before:w-[1px] before:h-[calc(100%-50px)] before:bg-zinc-800">
      <a
        href={job.url}
        rel="noreferrer noopener"
        className="min-h-[60px] min-w-[60px] rounded-md overflow-clip relative"
      >
        <Image
          src={job.companyLogo}
          className="object-cover"
          alt={`${job.companyName} logo`}
          fill
        />
      </a>
      <div className="flex flex-col items-start">
        <h3 className="text-xl font-bold">{job.companyName}</h3>
        <p>{job.jobTitle}</p>
        <small className="text-sm text-zinc-500 mt-2 tracking-widest uppercase">
          {job.startDate.toString()} -{" "}
          {job.endDate ? job.endDate.toString() : "Present"}
        </small>
        <p className="text-base text-zinc-400 my-4">{job.description}</p>
      </div>
    </div>
  );
};

export default Job;
